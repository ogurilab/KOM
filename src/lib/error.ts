function hasCodeType(error: unknown): error is { code: string } {
  return typeof (error as { code: string })?.code === "string";
}
function hasMessage(error: unknown): error is { message: string } {
  return typeof (error as { message: string })?.message === "string";
}

export const getSupabaseError = (error: unknown) => {
  if (!hasCodeType(error))
    return hasMessage(error) ? error.message : "エラーが発生しました。";

  switch (error.code) {
    case "23505":
      return "既に登録されています。";
    case "23514":
      return "パスワードが違います。";

    default:
      return hasMessage(error) ? error.message : "エラーが発生しました。";
  }
};
