import server from "nextjs-http-supertest";

afterAll(() => {
  server.close();
});

export default server;
