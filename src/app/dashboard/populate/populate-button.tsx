"use client";
import { Button } from "@/ui/button";


export const PopulateButton = () => {
  const handleClick = () => fetch(
    "http://localhost:8080/api/populate",
    { method: "POST" }
  )
    .then((response) => console.log(response))
    .catch((error) => console.log(error))

  return (
    <Button onClick={handleClick}>
      Populate
    </Button>
  )
}

