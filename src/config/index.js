module.exports = {
  exchange: {
    account: {
      id: 'exchange:app/account',
      queue: {
        balance: 'queue:app/account/balance',
        create: 'queue:app/account/create',
        delete: 'queue:app/account/delete',
        deposit: 'queue:app/account/deposit',
        withdrawal: 'queue:app/account/withdrawal'
      }
    }
  }
}
