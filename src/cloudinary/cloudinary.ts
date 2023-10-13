import { config } from '@/config';
import { ConfigOptions, v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: config.CLOUDINARY,
  useFactory: (): ConfigOptions => {
    return v2.config({
      cloud_name: 'dk6yblsoj', 
      api_key: '788486715779447', 
      api_secret: 'KF92y-bb8Lao2CM1tClEV9O0qL4' 
    });
  },
};
