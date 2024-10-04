/// <reference types="cypress" />
import produtosPage from "../support/page_objects/produtos.page";
import { faker } from '@faker-js/faker';

context('Exercicio - Testes End-to-end - Fluxo de pedido', () => {
    /*  Como cliente 
        Quero acessar a Loja EBAC 
        Para fazer um pedido de 4 produtos 
        Fazendo a escolha dos produtos
        Adicionando ao carrinho
        Preenchendo todas opções no checkout
        E validando minha compra ao final */

    beforeEach(() => {
        cy.visit('/')
    });

    it('Deve fazer um pedido na loja Ebac Shop de ponta a ponta', () => {
        //TODO: Coloque todo o fluxo de teste aqui, considerando as boas práticas e otimizações
        cy.visit('minha-conta') // <= acessar página de minha conta
        
        cy.fixture('perfil').then((dados) => { // <= fazer login 
            cy.login(dados.usuario, dados.senha)
        })

        //Adicionando 4 produtos usando massa de dados
        /*cy.fixture('produtos').then(dados => {
            let prod = 0
            produtosPage.buscarProduto(dados[prod].nomeProduto)
            produtosPage.addProdutoCarrinho(dados[prod].tamanho,
                dados[prod].cor,
                dados[prod].quantidade)

            cy.get('.woocommerce-message').should('contain', dados[prod].nomeProduto)
        });
        cy.fixture('produtos').then(dados => {
            let prod = 1
            produtosPage.buscarProduto(dados[prod].nomeProduto)
            produtosPage.addProdutoCarrinho(dados[prod].tamanho,
                dados[prod].cor,
                dados[prod].quantidade)

            cy.get('.woocommerce-message').should('contain', dados[prod].nomeProduto)
        });
        cy.fixture('produtos').then(dados => {
            let prod = 2
            produtosPage.buscarProduto(dados[prod].nomeProduto)
            produtosPage.addProdutoCarrinho(dados[prod].tamanho,
                dados[prod].cor,
                dados[prod].quantidade)

            cy.get('.woocommerce-message').should('contain', dados[prod].nomeProduto)
        });*/
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
        //cy.get('#billing_postcode').clear().type(faker.location.zipCode())
        //cy.get('#billing_phone').clear().type(faker.phone.number())

        //Checar os termos de uso
        cy.get('#terms').check()

        //Finalizar a compra
        cy.get('#place_order').click({force:true}) //Deu o mesmo problema :c

        //cy.wait(6000) // <= Esperar para não dar time out (???)

        //Checagem de sucesso
        cy.get('.woocommerce-notice').should('contain', 'Obrigado. Seu pedido foi recebido.')
    })
})