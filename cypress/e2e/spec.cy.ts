describe('My First Test', () => {
  it('Sanity test', () => {
    cy.visit('/');
    cy.contains('#header .text-3xl', 'Clips');
  });
});
