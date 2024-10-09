export default class User {
    public constructor(
        private readonly _id: number,
        private readonly _email: string,
        private readonly _nickname: string,
        private readonly _roles: string[]) { }

    public get id() { return this._id }

    public get email() { return this._email }

    public get nickname() { return this._nickname }

    public get roles() { return this._roles.slice() }

    public hasRole(role: string): boolean {
        return this._roles.indexOf(role) !== -1
    }
}
