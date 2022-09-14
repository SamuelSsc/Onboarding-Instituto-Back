import axios from "axios";

console.log("TESTANDO CREATE-USER");

describe("Mutation createUser", () => {
  it("should return createUser", async () => {
    const mutation = `
    mutation CreateUser($data: UserInput!){
        createUser(data:$data){
            id
            name
            email
            birthDate
        }
    }`;

    const VARIABLES = {
      name: "Test",
      email: "Samuel@gmailteste",
      password: "1234qwer",
      birthDate: "21/02/2002",
    };

    const response = await axios.post("http://localhost:4000/graphql", {
      mutation,
      variables: {
        data: VARIABLES,
      },
    });
    console.log("AQUI A RESPOSTA: ", response);

    // console.log(response.data);

    // expect(response.status).to.equal(200);
    // expect(response.data).to.be.deep.eq(EXPECTED_RESPONSE);
  });
});
