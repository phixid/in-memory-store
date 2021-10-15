import * as index from "./index"

// @ponicode
describe("clear", () => {
    let inst: any

    beforeEach(() => {
        inst = new index.Store(127, 0)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.clear()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("delete", () => {
    let inst: any

    beforeEach(() => {
        inst = new index.Store(127, 0)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.delete("elio@example.com")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.delete("constructor")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.delete("__proto__")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.delete(56784)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.delete("Elio")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.delete(-Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("get", () => {
    let inst: any

    beforeEach(() => {
        inst = new index.Store(127, 3600)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.get("Elio")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.get(987650)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.get(56784)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.get("bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.get(12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.get(Infinity)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getAll", () => {
    let inst: any

    beforeEach(() => {
        inst = new index.Store(161, 0)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.getAll()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("getConfiguration", () => {
    let inst: any

    beforeEach(() => {
        inst = new index.Store(127, 0)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.getConfiguration()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("memo", () => {
    let inst: any

    beforeEach(() => {
        inst = new index.Store(243, 7)
    })

    test("0", async () => {
        await inst.memo(0, () => 987650)
    })

    test("1", async () => {
        await inst.memo(12345, () => 12345)
    })

    test("2", async () => {
        await inst.memo(0, () => "return callback value")
    })

    test("3", async () => {
        await inst.memo("Dillenberg", () => false)
    })

    test("4", async () => {
        await inst.memo(987650, () => "a1969970175")
    })

    test("5", async () => {
        await inst.memo(Infinity, () => Infinity)
    })
})

// @ponicode
describe("set", () => {
    let inst: any

    beforeEach(() => {
        inst = new index.Store(243, 0)
    })

    test("0", () => {
        let callFunction: any = () => {
            inst.set(56784, "elio@example.com", "bc23a9d531064583ace8f67dad60f6bb")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction: any = () => {
            inst.set("constructor", 16, "a1969970175")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction: any = () => {
            inst.set("bc23a9d531064583ace8f67dad60f6bb", "Dillenberg", "a1969970175")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction: any = () => {
            inst.set(12, "elio@example.com", 56784)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction: any = () => {
            inst.set(987650, "elio@example.com", 12345)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction: any = () => {
            inst.set(NaN, NaN, NaN)
        }
    
        expect(callFunction).not.toThrow()
    })
})
