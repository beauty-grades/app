"use client";

import { Button } from "@/components/ui/button";

export const DownloadCurriculumButtom = () => {
  const handleClick = () => {
    fetch("https://api.utec.edu.pe/file-server-api/fileServer/downloadFile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token":
          "eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE2ODI4MDA4MjMsInN1YiI6ImFudGhvbnkuY3VldmFAdXRlYy5lZHUucGUiLCJhdWRpZW5jZSI6InVuZGV0ZXJtaW5lZCIsImNyZWF0ZWQiOjE2ODI3ODY0MjMxNDd9.oQCqN3451H6orduier3lQcQgevwp2S2OVOMpyLz1IH8QD0UjcwgY2u-GwmCyyZrI9M6S5dDjxR-4S-sM5Vnhvg",
      },
      body: JSON.stringify({
        idStorage: "zzz",
        nombreArchivo: "CI0027_2022 - 2_ES.pdf",
        pathStorage:
          "https://www.googleapis.com/drive/v3/files/10FmUnO2IcxizV-Z1pdGluAO3anfQU17f?alt=media",
      }),
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "file.pdf");
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
      });
  };

  return <Button onClick={handleClick}>Download File</Button>;
};
