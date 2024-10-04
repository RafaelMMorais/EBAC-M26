/// <reference types="cypress" />
import produtosPage from "../support/page_objects/produtos.page";
import { faker } from '@faker-js/faker';

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
    beforeEach(() => {
        cy.visit('/')
    });

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
        cy.visit('minha-conta') // <= acessar página de minha conta
        
        cy.fixture('perfil').then((dados) => { // <= fazer login 
            cy.login(dados.usuario, dados.senha)
        })

        cy.fixture('produtos').then(dados => {
            let prod = 3
            produtosPage.buscarProduto(dados[prod].nomeProduto)
            produtosPage.addProdutoCarrinho(dados[prod].tamanho,
                dados[prod].cor,
                dados[prod].quantidade)

            cy.get('.woocommerce-message').should('contain', dados[prod].nomeProduto)
        });
        
        //Ir para a pagina de carrinho
        cy.visit('carrinho')

        //Ir para pagamentos
        cy.get('.checkout-button').click()

        //Implementando dados fakes no cadastro
        cy.get('#billing_address_1').clear().type(faker.location.streetAddress())
        cy.get('#billing_city').clear().type(faker.location.city())
        cy.fixture('users').then((dados) => {cy.get('#billing_postcode').clear().type(dados.cep)})
        cy.fixture('users').then((dados) => {cy.get('#billing_phone').clear().type(dados.telefone)})

        //Checar os termos de uso
        cy.get('#terms').check()

        //Finalizar a compra
        cy.get('#place_order').click({force:true})

        //Checagem de sucesso
        cy.get('.woocommerce-notice').should('contain', 'Obrigado. Seu pedido foi recebido.')
    })
})