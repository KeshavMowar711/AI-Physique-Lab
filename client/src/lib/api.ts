export const getUploadSignature = async (token: string) => {
  if (!token) {
    throw new Error("Cannot query signature provider: User session token is currently blank.");
  }

  const response = await fetch("/api/uploads/signature", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });

  if (!response.ok) {
    const fallbackText = await response.text().catch(() => "No stack details available.");
    throw new Error(`Server signature path rejected call (${response.status}): ${fallbackText}`);
  }

  return response.json();
};