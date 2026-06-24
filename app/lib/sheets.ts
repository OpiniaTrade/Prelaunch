import { google } from "googleapis";

function getAuth() {
  const privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;

  if (!privateKey || !clientEmail) {
    return null;
  }

  // Handle both escaped and actual newlines in the key
  const formattedKey = privateKey.includes("\\n")
    ? privateKey.replace(/\\n/g, "\n")
    : privateKey;

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: formattedKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export async function appendToSheet(
  sheetName: string,
  values: string[]
) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    console.warn("GOOGLE_SHEETS_SPREADSHEET_ID not set, skipping sheet append");
    return;
  }

  const auth = getAuth();
  if (!auth) {
    console.warn("Google credentials not configured, skipping sheet append");
    return;
  }

  const sheets = google.sheets({ version: "v4", auth });

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [values],
      },
    });
  } catch (err: unknown) {
    // If sheet tab doesn't exist, try appending to Sheet1 with a label column
    const error = err as { code?: number };
    if (error.code === 400) {
      console.warn(`Sheet tab "${sheetName}" not found, using Sheet1`);
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A:Z",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[sheetName, ...values]],
        },
      });
    } else {
      throw err;
    }
  }
}
