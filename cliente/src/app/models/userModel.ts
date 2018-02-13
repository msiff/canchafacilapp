export class User {
    constructor(
        public _id: String,
        public name: String,
        public surname: String,
        public email: String,
        public password: String,
        public celular: String,
        public role: String,
        public image: String,
        public photoUrl: String,
        public isVerified: boolean,
        public ownerData: {},
        public clientData: {},
        public providers: {}
    ) {}
}
