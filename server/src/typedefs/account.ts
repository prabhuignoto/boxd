export default `
  type Name {
    given_name: String
    surname: String
    familiar_name: String
    display_name: String
    abbreviated_name: String
  }

  type Account {
    account_id: String
    name: Name
    email: String
    email_verified: Boolean
    disabled: Boolean
    is_teammate: Boolean
    profile_photo_url: String
  }

  type Allocation {
    allocated: Int
  }

  type SpaceUsage {
    used: String
    allocation: Allocation
  }
`;
