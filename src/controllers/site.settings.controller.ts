import { Types } from "mongoose";
import Settings from "../models/settings";
import { asyncHandler } from "../utils/async-wrapper";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export async function setSiteState() {
  //   Check if the settings document already exists
  const existingSettings = await Settings.findOne({
    _id: siteDefaults._id,
  });
  if (existingSettings) {
    return existingSettings;
  }

  const emptyState = new Settings({
    _id: siteDefaults._id,
  });

  await emptyState.save();
}

export const siteDefaults = {
  _id: new Types.ObjectId("000000000000000000000000"),
};

const settingsValidationSchema = Joi.object({
  socialLinks: Joi.object({
    facebook: Joi.string().uri().allow(null).optional(),
    instagram: Joi.string().uri().allow(null).optional(),
    twitter: Joi.string().uri().allow(null).optional(),
    youtube: Joi.string().uri().allow(null).optional(),
    tiktok: Joi.string().uri().allow(null).optional(),
  }).optional(), // Make the entire socialLinks object optional

  whatsapp: Joi.string().optional(), // You might want to add regex for phone number validation
  email: Joi.string().email().optional(),
  address: Joi.string().optional(),
});

export const updateSitesSettings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = settingsValidationSchema.validate(req.body) as {
      error: Joi.ValidationError | undefined;
      value: {
        socialLinks: {
          facebook: string | null;
          instagram: string | null;
          twitter: string | null;
          youtube: string | null;
          tiktok: string | null;
        };
        whatsapp: string;
        email: string;
        address: string;
      };
    };

    if (error || !value) {
      return res.status(400).json({
        message: error?.message || "Invalid input",
      });
    }

    const settings = await Settings.findByIdAndUpdate(
      siteDefaults._id,
      {
        $set: value,
      },
      { new: true }
    );

    if (!settings) {
      return res.status(404).json({
        message: "Settings not found",
      });
    }

    return res.status(200).json({
      message: "Settings updated successfully",
      settings,
    });
  }
);

export const getSiteSettings = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const settings = await Settings.findById(siteDefaults._id);

    if (!settings) {
      return res.status(404).json({
        message: "Settings not found",
      });
    }

    return res.status(200).json({
      message: "Settings retrieved successfully",
      data: { links: settings },
    });
  }
);
