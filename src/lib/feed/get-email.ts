export const getEmail = async (token2: string) => {
  const response = await fetch(
    "https://api.utec.edu.pe/user-configuration-api/user/information/data",
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token2}`,
        "X-Auth-Token": "hey",
        "Content-Type": "application/json"
      },
      body: "{}"
    }
  )

  const data = await response.json()

  const email = (data?.content?.email as string) || null

  return email
}

const test_token2 = "eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJiMmRkMTYxMS1kZTFiLTQ5YWQtYWY3My1kYTExMTYyMmRiNGEiLCJpYXQiOjE2ODE5NTU3NTgsInN1YiI6ImFudGhvbnkuY3VldmFAdXRlYy5lZHUucGUiLCJleHAiOjE2ODE5NzAxNTh9.v943ExDm_xOkIPidm7v765ONco6gdTq1G4hafrMIjw4"
const test_email = getEmail(test_token2)

console.log(test_email)
