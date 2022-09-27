import * as bcrypt from "bcrypt";
import { dataSource } from "../data-source";
import { Address, User } from "../entity";

export async function testRelations() {
  const ROUNDS = 10;
  const user = new User();
  user.name = "Test address";
  user.email = "testingAdress@gmail.com";
  user.birthDate = "12/05";
  user.password = await bcrypt.hash("1234qwer", ROUNDS);

  const address1 = new Address();
  address1.cep = "132456789";
  address1.city = "Itapecerica";
  address1.state = "Sp";
  address1.complement = null;
  address1.street = "Estrada mato a dentro";
  address1.streetNumber = "5874";
  address1.neighborhood = "samambaia";

  const address2 = new Address();
  address2.cep = "123456798";
  address2.city = "São Paulo";
  address2.state = "Sp";
  address2.complement = "apto 204";
  address2.street = "Luis Grassman";
  address2.streetNumber = "200";
  address2.neighborhood = "Jardim Mirante ZS";

  const address3 = new Address();
  address3.cep = "12345";
  address3.city = "Embu";
  address3.state = "Sp";
  address3.complement = null;
  address3.street = "Dr. Antenor Stamato";
  address3.streetNumber = "500";
  address3.neighborhood = "Ressaca";

  user.addresses = [address1, address2, address3];
  await dataSource.save(user);
}
