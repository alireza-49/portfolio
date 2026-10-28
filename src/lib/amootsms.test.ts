import { afterEach, describe, expect, it, vi } from "vitest";
import {
  amootSendDateTime,
  describeAmootHttpError,
  describeAmootStatus,
  parseAmootResponse,
  sendAmootSms,
} from "./amootsms";

const SUCCESS = {
  MessageText: null,
  SMSPagesCount: 1,
  CampaignID: 0,
  Price: 1200,
  Status: "Success",
  Data: [{ Mobile: 9121234567, MessageID: 1234568, Status: "Success" }],
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("amoot responses", () => {
  it("reads a successful send", () => {
    expect(parseAmootResponse(SUCCESS)).toEqual({
      ok: true,
      status: "Success",
      message: "پیامک پذیرفته شد.",
      messageId: "1234568",
    });
  });

  it("treats an unknown token as a failure", () => {
    const result = parseAmootResponse({
      Status: "Token_NotExists",
      Data: [],
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe("Token_NotExists");
    expect(result.message).toBe("توکن آموت در سامانه وجود ندارد.");
  });

  it("prefers the provider's own ErrorMessage", () => {
    const result = parseAmootResponse({
      Status: "ServerError",
      ErrorMessage:
        "Unable to cast object of type 'Newtonsoft.Json.Linq.JArray' to type 'Newtonsoft.Json.Linq.JValue'.",
      Data: [],
    });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("JArray");
  });

  it("rejects a recipient row that failed under a Success envelope", () => {
    const result = parseAmootResponse({
      Status: "Success",
      Data: [{ Mobile: 9121234567, MessageID: 9, Status: "Mobile_NotExist" }],
    });

    expect(result.ok).toBe(false);
    expect(result.status).toBe("Mobile_NotExist");
    expect(result.message).toContain("Mobile_NotExist");
  });

  it("does not call Success with empty Data a delivered message", () => {
    const result = parseAmootResponse({ Status: "Success", Data: [] });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("برنگرداند");
  });

  it("survives a body that is not Amoot's at all", () => {
    expect(parseAmootResponse(null).ok).toBe(false);
    expect(parseAmootResponse("oops").ok).toBe(false);
    expect(parseAmootResponse([]).ok).toBe(false);
    expect(parseAmootResponse({}).message).toBe("ارتباط با آموت برقرار نشد.");
  });
});

describe("amoot status words", () => {
  it("explains the words an operator will actually hit", () => {
    expect(describeAmootStatus("Success")).toBe("پیامک پذیرفته شد.");
    expect(describeAmootStatus("Token_Invalid")).toContain("توکن");
    expect(describeAmootStatus("Token_NotExists")).toContain("وجود ندارد");
    expect(describeAmootStatus("ServerError")).toContain("سرور");
  });

  it("surfaces an unknown word instead of hiding it", () => {
    expect(describeAmootStatus("RateLimited")).toContain("RateLimited");
    expect(describeAmootStatus(null)).toBe("ارتباط با آموت برقرار نشد.");
  });

  it("explains the backup-line checks of SendWithBackupLine", () => {
    expect(describeAmootStatus("BackupLineNumber_Empty")).toContain("98");
    expect(describeAmootStatus("BackupLineNumber_NotExist")).toContain("98");
    expect(describeAmootStatus("Mobiles_Empty")).toContain("9121234567");
  });

  it("explains HTTP-level failures", () => {
    expect(describeAmootHttpError(401)).toContain("توکن");
    expect(describeAmootHttpError(429)).toContain("بیش از حد");
    expect(describeAmootHttpError(503)).toContain("سرور");
    expect(describeAmootHttpError(499)).toContain("499");
  });
});

describe("amoot request", () => {
  it("formats SendDateTime in Tehran wall time", () => {
    expect(amootSendDateTime("2026-10-27T06:44:38Z")).toBe("2026-10-27 10:14:38");
    expect(amootSendDateTime("not-a-date")).toBe("1970-01-01 00:00:00");
  });

  it("posts a string Mobiles, the raw token and the public line by default", async () => {
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >(
      async () =>
        new Response(JSON.stringify(SUCCESS), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await sendAmootSms({
      token: "tok-123",
      receptor: "09121234567",
      message: "سلام",
      now: "2026-10-27T06:44:38Z",
    });

    expect(result.ok).toBe(true);
    // The method with the advertising-line guarantee, not the plain /SendSimple.
    expect(String(fetchMock.mock.calls[0]?.[0])).toBe(
      "https://portal.amootsms.com/rest/SendWithBackupLine",
    );
    const init = fetchMock.mock.calls[0]?.[1] as RequestInit;
    expect(init.method).toBe("POST");
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBe("tok-123");
    const body = JSON.parse(String(init.body)) as Record<string, unknown>;
    // A string in Amoot's national form; the live endpoint rejects an array.
    expect(body.Mobiles).toBe("9121234567");
    expect(body.LineNumber).toBe("public");
    // Required by this method: "public" is rejected, «98» is the documented line.
    expect(body.BackupLineNumber).toBe("98");
    expect(body.SendDateTime).toBe("2026-10-27 10:14:38");
  });

  it("keeps a configured sender line and refuses a blank token locally", async () => {
    const fetchMock = vi.fn<
      (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>
    >(
      async () =>
        new Response(JSON.stringify(SUCCESS), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    await sendAmootSms({
      token: " tok-123 ",
      sender: "10004346",
      receptor: "09121234567",
      message: "سلام",
    });
    const body = JSON.parse(
      String((fetchMock.mock.calls[0]?.[1] as RequestInit).body),
    ) as Record<string, unknown>;
    expect(body.LineNumber).toBe("10004346");

    // A caller that owns a different backup line can override the «98» default.
    await sendAmootSms({
      token: "tok-123",
      sender: "10004346",
      receptor: "09121234567",
      message: "سلام",
      backupLine: " 98 ",
    });
    const overridden = JSON.parse(
      String((fetchMock.mock.calls[1]?.[1] as RequestInit).body),
    ) as Record<string, unknown>;
    expect(overridden.BackupLineNumber).toBe("98");

    const blank = await sendAmootSms({
      token: "   ",
      receptor: "09121234567",
      message: "سلام",
    });
    expect(blank.ok).toBe(false);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
