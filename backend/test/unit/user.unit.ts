import {assert} from "chai";

import { User } from '../../src/entities/user.entity';
import * as bcrypt from 'bcrypt';

describe("User Entity Methods", () =>  {
    describe("#hashPassword", () =>  {
        it("should NOT return the same hashed password given the same values", async () =>  {
            const first = await User.hashPassword('unittesting')
            const second = await User.hashPassword('unittesting')

            assert.notEqual(first, second);
        });

        it("bcrypt password compare should match", async () =>  {
            const clearPassword = "holahola"
            const hashedPassword = await  User.hashPassword(clearPassword)

            const match = await bcrypt.compare(clearPassword, hashedPassword);

            assert.isTrue(match)
        });
    });
});
