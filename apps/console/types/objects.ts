export interface IUser {
  image: string;
  _id?: string;
  walletAddress: string;
  email: string;
  name: string;
  profile?: {
    bio?: string;
    avatar?: string;
    linkedin?: string;
    website?: string;
    documents?: string[];
  };
  userType: 'user' | 'institution' |'company' | 'verifier';
  isVerified: boolean;
  isAdmin?: boolean;
  credentialsOwned?: ICredentialOwnership[];
  preferences?: {
    notifications: boolean;
    publicProfile: boolean;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICredentialOwnership {
  tokenId: string;
  issuer: string;
  credentialType: string;
  issueDate: Date;
  onChain: boolean;
}

export interface IOrganisationApplication extends Document {
  id: string;
  user: IUser;
  type: 'institution' | 'company';
  description: string;
  document: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}