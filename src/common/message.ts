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
    NOT_FOUND_PUBLICKEY: 'Not found publickey of current user'
  },
  Film: {
    NFT_COLLECTION_NOT_CREATED: 'This collection of this film has not been created'
  }
}

export const MessageName = {
  user: 'User',
  filmMaker: 'FilmMaker',
  film: 'Film',
  cNFT: 'CNFT',
  collectionNFT: 'CollectionNFT'
}
