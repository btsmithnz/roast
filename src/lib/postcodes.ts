export function parsePostcodeOffset(postcode: string | null | undefined) {
  if (!postcode) {
    return null;
  }

  const parsed = Number.parseInt(postcode.replace(/\D/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : null;
}

export function postcodeOffset(
  postcode: string | null | undefined,
  referencePostcode: string | null | undefined,
) {
  const parsedPostcode = parsePostcodeOffset(postcode);
  const parsedReference = parsePostcodeOffset(referencePostcode);

  if (parsedPostcode === null || parsedReference === null) {
    return null;
  }

  return Math.abs(parsedPostcode - parsedReference);
}
