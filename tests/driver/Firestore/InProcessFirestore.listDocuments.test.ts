import { InProcessFirestore } from "../../../src/driver/Firestore/InProcessFirestore"

describe("In-process Firestore collection listing documents", () => {
    const db = new InProcessFirestore()

    beforeEach(() => {
        db.reset()
    })

    test("list documents empty collection", async () => {
        // Given an empty collection;
        const collectionRef = db.collection("animals")

        // When we list documents;
        const listedDocuments = await collectionRef.listDocuments()

        // Then it should be empty.
        expect(listedDocuments).toHaveLength(0)
        expect(listedDocuments).toStrictEqual([])
    })

    test("list documents on collection", async () => {
        // Given an empty collection with some documents;
        await db.collection("animals").add({ name: "tiger" })
        await db.collection("animals").add({ name: "elephant" })
        await db.collection("animals").add({ name: "kangaroo" })

        // When we list documents;
        const listedDocuments = await db.collection("animals").listDocuments()

        // Then we should get references to all the documents.
        expect(listedDocuments).toHaveLength(3)
        expect((await listedDocuments[0].get()).data()).toEqual({
            name: "tiger",
        })
        expect((await listedDocuments[1].get()).data()).toEqual({
            name: "elephant",
        })
        expect((await listedDocuments[2].get()).data()).toEqual({
            name: "kangaroo",
        })
    })

    test("listDocuments with numeric id", async () => {
        // Given we add a document with a numeric id;
        await db
            .collection("things")
            .doc("123")
            .create({ foo: "bar" })

        // When we list documents on that collection;
        const docs = await db.collection("things").listDocuments()

        // Then we should get that single doc.
        expect(docs.length).toBe(1)
        expect((await docs[0].get()).data()).toEqual({ foo: "bar" })
    })
})
