module.exports = {
  schema: {
    [process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT]: {
      headers: {
        "x-hasura-admin-secret":
          process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET_KEY,
      },
    },
  },
  documents: "src/utils/apollo/graphql/query/*.graphql",
  generates: {
    "src/utils/apollo/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-apollo",
      ],
      config: {
        withHooks: true,
        scalars: {},
        namingConvention: {
          typeName: "pascal-case#pascalCase",
          enumValues: "upper-case#upperCase",
        },
      },
    },
  },
};
