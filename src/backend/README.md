# Sumula (Back-end)

Esse parte do repositório serve as APIs do projeto

# Como funciona

Os comandos do prisma estão disponíveis como scripts no package.json, pois são utilizadas variáveis de ambiente para selecionar o banco de dados.

```bash
npx prisma migrate dev
npx prisma studio
npx prisma generate (rodar os generators)
npx prisma introspect
npx prisma db push (prototipar banco de dados)
```

# Banco de Dados

Há dois containers para os bancos dev e test. A prototipagem deve ser feita no banco dev. Eventualmente é necessário forçar as alterações ou limpar todo o banco para reiniciar o processo.

O adminer ajuda nessas atividades
