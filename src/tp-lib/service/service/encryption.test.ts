import Encryption from './encryption'

describe('localStorage', () => {
    it(`Should work in test environment`, () => {
        const input = `eastern-egg-${Date.now()}`
        window.localStorage.setItem("Test", input)
        const result = window.localStorage.getItem("Test")
        window.localStorage.removeItem("Test")
        expect(result).toEqual(input)
    })
})

describe('web-service/encryption', () => {
    it(`Should retrieve my credentials`, () => {
        Encryption.set({ username: "Hello", password: "World!" })
        const result = Encryption.get()
        expect(result.username).toEqual('Hello')
        expect(result.password).toEqual('World!')
    })

    it('Should clear', () => {
        Encryption.set({ username: "Hello", password: "World!" })
        Encryption.clear()
        const result = Encryption.get()
        expect(result.username).toEqual('')
    })
})
