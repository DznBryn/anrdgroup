import type { ReactNode } from "react";
import type { ENUM_DIALOGS_TYPE } from "@/lib/conts";
export declare interface ENV_PROPS {
  KLAVIYO_TEST_API_KEY?: string
  KLAVIYO_API_VERSION?: string
  KLAVIYO_SELLER_LIST?: string
  KLAVIYO_SITE_ID?: string
}

export declare interface ModalProps {
  modal: ENUM_DIALOGS_TYPE | string;
  onChange: (string: string) => void;
  handleCreateUser: (formData: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    accountType?: 'tenant' | 'landlord' | 'manager' | 'admin';
  }) => Promise<{ success: boolean; userId?: string; error?: string }>;
}

export declare interface FormProps {
  user: object | null;
  onUserChange: (user: object) => void;
}

export declare interface SectionProps {
  header?: string;
  children: ReactNode;
  backgroundImage?: string;
  styles?: {
    wrapper?: string;
    container?: string;
    backgroundColor?: string;
  };
}

export type SituationProps = {
  type: string,
  description: string
}

export type ProcessCardProps = {
  image?: ReactNode;
  header?: string;
  content?: string;
  button?: ReactNode;
}

// Klaviyo API
export type GetProfileProps = {
  type: "profile";
  id: string;
  attributes: {
    email: string;
    phone_number: string;
    external_id: string;
    first_name: string;
    last_name: string;
    organization?: string;
    locale?: string;
    title?: string;
    image?: string;
    created?: string;
    updated?: string;
    last_event_date?: string;
    location?: {
      address1: string;
      address2: string;
      city: string;
      country: string;
      latitude: string;
      longitude: string;
      region: string;
      zip: string;
      timezone: string;
      ip: string;
    };
    properties?: { [key: string]: string };
    subscriptions?: {
      email?: {
        marketing: {
          can_receive_email_marketing: boolean;
          consent: string;
          consent_timestamp: string;
          last_updated: string;
          method: string;
          method_detail: string;
          custom_method_detail: string;
          double_optin: string;
          suppression: {
            reason: string;
            timestamp: string;
          }[];
          list_suppressions: {
            list_id: string;
            reason: string;
            timestamp: string;
          }[];
        };
      };
      sms?: {
        marketing: {
          can_receive_sms_marketing: boolean;
          consent: string;
          consent_timestamp: string;
          method: string;
          method_detail: string;
          last_updated: string;
        };
      };
    };
    predictive_analytics?: {
      historic_clv?: number;
      predicted_clv?: number;
      total_clv?: number;
      historic_number_of_orders?: number;
      predicted_number_of_orders?: number;
      average_days_between_orders?: number;
      average_order_value?: number;
      churn_probability?: number;
      expected_date_of_next_order?: string;
    };
  };
  relationships?: {
    lists?: {
      data?: {
        type: string;
        id: string;
      }[];
      links?: {
        self: string;
        related: string;
      };
    };
    segments: {
      data?: {
        type: string;
        id: string;
      }[];
      links?: {
        self: string;
        related: string;
      };
    };
  };
  links?: {
    self: string;
  };
};


export type CreateProfileOutputProps = {
  type: 'profile',
  id: string,
  attributes: {
    email: string,
    phone_number: string,
    external_id: string,
    first_name: string,
    last_name: string,
    organization?: string,
    locale?: string,
    title?: string,
    image?: string,
    created?: string,
    updated?: string,
    last_event_date?: string,
    location?: {
      address1: string,
      address2: string,
      city: string,
      country: string,
      latitude: string,
      longitude: string,
      region: string,
      zip: string,
      timezone: string,
      ip: string
    },
    properties?: {
      pseudonym: string
    },
    subscriptions?: {
      email?: {
        marketing: {
          can_receive_email_marketing: boolean,
          consent: string,
          consent_timestamp: string,
          last_updated: string,
          method: string,
          method_detail: string,
          custom_method_detail: string,
          double_optin: string,
          suppression: {
            reason: string,
            timestamp: string
          }[],
          list_suppressions: {
            list_id: string,
            reason: string,
            timestamp: string
          }[]
        }
      },
      sms?: {
        marketing: {
          can_receive_sms_marketing: boolean,
          consent: string,
          consent_timestamp: string,
          method: string,
          method_detail: string,
          last_updated: string
        }
      }
    },
    predictive_analytics?: {
      historic_clv?: number,
      predicted_clv?: number,
      total_clv?: number,
      historic_number_of_orders?: number,
      predicted_number_of_orders?: number,
      average_days_between_orders?: number,
      average_order_value?: number,
      churn_probability?: number,
      expected_date_of_next_order?: string
    }
  },
  relationships?: {
    lists?: {
      data?: {
        type: string,
        id: string
      }[],
      links?: {
        self: string,
        related: string
      }
    },
    segments: {
      data?: {
        type: string,
        id: string
      }[],
      links?: {
        self: string,
        related: string
      }
    }
  },
  links?: {
    self: string
  }
}

export type CreateProfileInputProps = {
  type: 'profile';
  attributes: {
    email: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    organization?: string;
    title?: string;
    image?: string;
    location?: {
      address1: string;
      address2: string;
      city: string;
      country: string;
      region: string;
      zip: string;
      timezone: string;
    };
    properties?: { [key: string]: string };
  };
};

export type UpdateProfileInputProps = {
  id: string;
  type: 'profile';
  attributes: {
    email: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    organization?: string;
    title?: string;
    image?: string;
    location?: {
      address1: string;
      address2: string;
      city: string;
      country: string;
      region: string;
      zip: string;
      timezone: string;
      ip: string;
    };
    properties?: { [key: string]: string };
  };
  meta?: {
    patch_properties?: { append?: { [key: string]: string }; unappend?: { [key: string]: string }; unset?: string };
  };
};

export type SubscribeProfileProps = {
  type: 'profile-subscription-bulk-create-job';
  attributes: {
    custom_source?: string
    profiles: {
      data: {
        type: 'profile';
        id?: string;
        attributes: {
          email: string;
          phone_number: string;
          subscriptions?: {
            email?: { marketing: { consent: string, consented_at?: Date } };
            sms?: { marketing: { consent: string, consented_at?: Date } };
          };
        };
      }[];
    };
  };
  relationships?: { list?: { data?: { type: 'list'; id: string } } };
};

export interface JWTPayload {
  userId: string;
  email: string;
  accountType: string;
}
