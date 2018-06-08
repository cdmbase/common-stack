
import { Feature } from '../connector';
import vendorType from './samples/graphql/types/vendor_type';
import personEntityType from './samples/graphql/types/person_entity_type';
import personSearchType from './samples/graphql/types/person_search_type';
import 'jest';

const normalizeWhitespace = str => str.replace(/\s+/g, ' ').trim();


describe('schema merge test', function () {

    it('returns minimal schema', () => {
        const types = [vendorType];
        const feature = new Feature({schema: vendorType});
        const feature2 = new Feature({schema: personEntityType}, feature);
        console.log(feature2.schemas);
        const expectedSchemaType = normalizeWhitespace(`
        schema {
            query: Query
          }
          type Query {
            vendors: [Vendor]
          }
          type Vendor implements PersonEntity {
            id: ID!
            name: String
            age: Int
            dob: Date
          }
        `);

    });

});
