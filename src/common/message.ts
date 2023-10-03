export const Message = {
  Base: {
    Default: (message: string) => `${message}`,
    NotFound: (message: string) => `${message}_not_found`,
    Exists: (message: string) => `${message}_already_exist`,
    Expired: (message: string) => `${message}_expired`,
    Incorrect: (message: string) => `${message}_is_incorrect`,
    AccessDenied: () => `access_denied`
  },
  User: {
    NOT_FOUND_PUBLICKEY: 'Not found publickey of current user',
    CAN_NOT_SUBSCRIBE_TO_WHITELIST: 'Can not subscribe to whitelist'
  },
  Film: {
    NFT_COLLECTION_NOT_CREATED: 'This collection of this film has not been created'
  }
}

export const MessageName = {
  user: 'User',
  filmMaker: 'FilmMaker',
  film: 'Film',
  gallery: 'Gallery',
  cNFT: 'CNFT',
  collectionNFT: 'CollectionNFT'
}
