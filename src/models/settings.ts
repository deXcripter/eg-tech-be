import { model, Model, Schema } from "mongoose";

export interface iSettings {
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
}

export interface iSettingsMethods {}

export interface iSettingsModel
  extends Model<iSettings, {}, iSettingsMethods> {}

const SettingsSchema = new Schema<iSettings, iSettingsModel, iSettingsMethods>(
  {
    socialLinks: {
      facebook: {
        type: String,
        default: null,
      },
      instagram: {
        type: String,
        default: null,
      },
      twitter: {
        type: String,
        default: null,
      },
      youtube: {
        type: String,
        default: null,
      },
      tiktok: {
        type: String,
        default: null,
      },
    },

    whatsapp: {
      type: String,
      required: [true, "Whatsapp number is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
    },

    address: {
      type: String,
      required: [true, "Address is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Settings = model<iSettings, iSettingsModel>(
  "EgreatStore",
  SettingsSchema
);
export default Settings;
