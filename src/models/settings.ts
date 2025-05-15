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
    },

    email: {
      type: String,
    },

    address: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Settings = model<iSettings, iSettingsModel>(
  "EvergreatSettings",
  SettingsSchema
);
export default Settings;
