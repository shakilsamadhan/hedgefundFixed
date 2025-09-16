"""
Service layer for Bloomberg API interactions using blpapi.
Reads environment variables for config.
"""
import os
import blpapi
from blpapi import SessionOptions, Session, Service

class BloombergClient:
    """Wrapper around Bloomberg API session and requests."""
    def __init__(self):
        options = SessionOptions()
        options.setServerHost(os.getenv("BLP_HOST", "localhost"))
        options.setServerPort(int(os.getenv("BLP_PORT", 8194)))
        self.session = Session(options)
        if not self.session.start():
            raise ConnectionError("Failed to start Bloomberg session")
        if not self.session.openService("//blp/refdata"):
            raise ConnectionError("Failed to open //blp/refdata service")
        self.svc = self.session.getService("//blp/refdata")

    def bulk_fetch(self, tickers: list, fields: list) -> dict:
        """
        Fetch bulk market data for given tickers and fields.
        Returns dict[ticker] -> dict[field] -> value
        """
        request = self.svc.createRequest("ReferenceDataRequest")
        for t in tickers:
            request.getElement("securities").appendValue(t)
        for f in fields:
            request.getElement("fields").appendValue(f)

        self.session.sendRequest(request)
        results = {}
        while True:
            ev = self.session.nextEvent()
            for msg in ev:
                if msg.messageType() == "ReferenceDataResponse":
                    for securityData in msg.getElement("securityData").values():
                        ticker = securityData.getElementAsString("security")
                        fldData = securityData.getElement("fieldData")
                        results[ticker] = {f: fldData.getElementAsFloat(f) if fldData.hasElement(f) else None for f in fields}
            if ev.eventType() == blpapi.Event.RESPONSE:
                break
        return results