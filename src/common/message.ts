export const Message = {
  Base: {
    Default: (message: string) => `${message}`,
    NotFound: (message: string) => `${message}_not_found`,
    Exists: (message: string) => `${message}_already_exist`,
    Expired: (message: string) => `${message}_expired`,
    Incorrect: (message: string) => `${message}_is_incorrect`,
    AccessDenied: () => `access_denied`
  },
  User: {}
}

export const MessageName = {
  user: 'user',
  filmMaker: 'filmMaker'
}
