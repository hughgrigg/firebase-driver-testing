import { InProcessFirestore } from "../../../src/driver/Firestore/InProcessFirestore"

/**
 * https://firebase.google.com/docs/firestore/manage-data/transactions#batched-writes
 */
describe("In-process Firestore batched writes", () => {
    test("documentation example batch", async () => {
        // Given we have a in-process Firestore DB;
        const db = new InProcessFirestore()

        // And there is some initial data;
        await db
            .collection("cities")
            .doc("SF")
            .set({
                name: "San Francisco",
                state: "CA",
                country: "USA",
                capital: false,
                population: 860000,
            })
        await db
            .collection("cities")
            .doc("LA")
            .set({
                name: "Los Angeles",
                state: "LA",
                country: "USA",
                capital: false,
                population: 4000000,
            })

        // When we get a new write batch;
        const batch = db.batch()

        // And set the value of 'NYC';
        const nycRef = db.collection("cities").doc("NYC")
        batch.set(nycRef, { name: "New York City" })

        // And update the population of 'SF';
        const sfRef = db.collection("cities").doc("SF")
        batch.update(sfRef, { population: 1000000 })

        // And delete the city 'LA';
        const laRef = db.collection("cities").doc("LA")
        batch.delete(laRef)

        // When we commit the batch;
        await batch.commit()

        // And get the data;
        const newYork = await db
            .collection("cities")
            .doc("NYC")
            .get()
        const sanFrancisco = await db
            .collection("cities")
            .doc("SF")
            .get()
        const losAngeles = await db
            .collection("cities")
            .doc("LA")
            .get()

        // Then the data should have been updated correctly.
        expect(newYork.exists).toBeTruthy()
        expect(newYork.data()).toEqual({ name: "New York City" })

        expect(sanFrancisco.exists).toBeTruthy()
        expect(sanFrancisco.data()).toEqual({
            name: "San Francisco",
            state: "CA",
            country: "USA",
            capital: false,
            population: 1000000,
        })

        expect(losAngeles.exists).toBeFalsy()
        expect(losAngeles.data()).toEqual(undefined)
    })
})
