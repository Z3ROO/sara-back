import { ISupplements } from "../../features/interfaces/interfaces";
import { SupplementsRepo } from "./SupplementsRepo"

describe('Supplements Repository', () => {
  test('Should successfully retrieve all supplements consumed', async () => {
    const dummySupplementBodyPart = { qtd: "3600000" }
    const { records } = await SupplementsRepo.findAllSupplements();
    
    records.forEach((record) => expect(record).toMatchObject(dummySupplementBodyPart));
  });

  test('Should successfully retrieve all supplements with specified name', async () => {
    const dummySupplementName = 'Free Time';
    const { records } = await SupplementsRepo.findSupplementsByName(dummySupplementName);

    records.forEach((record) => expect(record.name).toBe(dummySupplementName));
  });

  // test('Should successfully retrieve all supplements with specified date', async () => {
  //   const dummySupplementName = 'Bonus Hours';
  //   const { status, rows } = await SupplementsRepo.findSupplementsByDate(dummySupplementName);

  //   expect(status).toBe('success');
  //   rows.forEach((row) => {
  //     expect(row.name).toBe(dummySupplementName)
  //   });
  // })

  test('Should successfully insert a new supplement', async () => {
    const dummySupplement: ISupplements = {
      name: 'Free Time',
      qtd: 3600000,
    }
    const beforeInsert = await SupplementsRepo.findAllSupplements();
    await SupplementsRepo.insertSupplement(dummySupplement);
    const afterInsert = await SupplementsRepo.findAllSupplements();

    expect(afterInsert.records.length).toBe(beforeInsert.records.length+1);
  })
})