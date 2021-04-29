export const filterNotNull = <T>(i: T): i is NonNullable<typeof i> => !!i;
