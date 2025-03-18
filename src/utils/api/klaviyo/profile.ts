
import { KLAVIYO_API } from "@/lib/conts";
import type { CreateProfileInputProps, CreateProfileOutputProps, ENV_PROPS, SubscribeProfileProps, UpdateProfileInputProps } from "@/types/type";

interface Props {
  data?: FormData
  context: ENV_PROPS
}

export function getKlaviyoHeaders({ context }: Props) {

  return {
    accept: 'application/json',
    revision: context.KLAVIYO_API_VERSION,
    'content-type': 'application/json',
    Authorization: `Klaviyo-API-Key ${context.KLAVIYO_TEST_API_KEY}`,
  }
}

export async function createProfile({ data, context }: Props) {
  const url = KLAVIYO_API.PROFILES;
  const phone_number = String(data?.get('phone') ? '+1' + data.get('phone') : '')?.replace('-', '')
  const property = `${data?.get('address')}, ${data?.get('city')}, ${data?.get('state')}, ${data?.get('zip')}`
  const body = JSON.stringify({
    data: {
      type: 'profile',
      attributes: {
        email: data?.get('email') ?? '',
        phone_number,
        first_name: data?.get('first_name') ?? '',
        last_name: data?.get('last_name') ?? '',
        organization: '',
        title: '',
        image: '',
        location: {
          address1: data?.get('address') ?? '',
          address2: '',
          city: data?.get('city') ?? '',
          country: 'United States',
          region: data?.get('state') ?? '',
          zip: data?.get('zip') ?? '',
          timezone: '',
        },
        properties: { property_address: data?.get('address') ? property : '' },
      },
    } as CreateProfileInputProps,
  })

  const options = {
    method: 'POST',
    headers: getKlaviyoHeaders({ context }) as HeadersInit,
    body,
  };

  try {
    const response = await fetch(url, options)
    const res: {
      data?: CreateProfileOutputProps
    } = await response.json()

    if (res?.data?.id) {
      const subscribe: SubscribeProfileProps = {
        type: 'profile-subscription-bulk-create-job',
        attributes: {
          custom_source: 'Marketing Event',
          profiles: {
            data: [
              {
                type: 'profile',
                id: res.data.id,
                attributes: {
                  email: res.data.attributes.email,
                  phone_number: res.data.attributes.phone_number,
                  subscriptions: {
                    email: {
                      marketing: {
                        consent: 'SUBSCRIBED'
                      }
                    },
                    sms: {
                      marketing: {
                        consent: 'SUBSCRIBED',

                      }
                    }
                  }
                }
              }
            ]
          }
        },
        relationships: { list: { data: { type: 'list', id: context.KLAVIYO_SELLER_LIST as string } } }
      }

      const subscribed = await subscribeProfile({ data: subscribe, context })
      
      if (subscribed?.errors) return subscribed
      
      return res
    }
    return res
  } catch (error) {
    return {
      data: error,
    }
  }
}

export async function updateProfile({ data, context }: {
  data: UpdateProfileInputProps,
  context: ENV_PROPS
}) {
  const url = `${KLAVIYO_API.PROFILES}${data.id}`;
  const body = JSON.stringify({
    data
  })
  const options = {
    method: 'PATCH',
    headers: getKlaviyoHeaders({ context }) as HeadersInit,
    body,
  };

  try {
    const response = await fetch(url, options)
    const res = await response.json()
   
    return res
  } catch (error) {
    return {
      data: error,
    }
  }

}

type SubscribeProps = {
  data: SubscribeProfileProps,
  context: ENV_PROPS
}
export async function subscribeProfile({ data, context }: SubscribeProps) {
  const url = KLAVIYO_API.SUBSCRIBE;
  const body = JSON.stringify({
    data
  })
  const options = {
    method: 'POST',
    headers: getKlaviyoHeaders({ context }) as HeadersInit,
    body,
  };

  try {
    const response = await fetch(url, options)
    const res = await response.json()
    return res
  } catch (error) {
    return {
      data: error,
    }
  }
}

interface GetProfilesProps extends Props {
  filters?: string | null
}

export async function getProfiles({ filters, context }: GetProfilesProps) {
  const filter = filters ? `?${filters}` : '';
  const url = `${KLAVIYO_API.PROFILES}${filter}`;
  const options = {
    method: 'GET',
    headers: getKlaviyoHeaders({ context }) as HeadersInit,
  };

  try {
    const response = await fetch(url, options)
    const res = await response.json()
    return res
  } catch (error) {
    return {
      data: error,
    }
  }
}