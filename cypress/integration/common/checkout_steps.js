import { Given, When, And } from 'cypress-cucumber-preprocessor/steps'

const homeObj = require('../../support/object/home_obj.json');
const productObj = require('../../support/object/product_obj.json');
const checkoutObj = require('../../support/object/checkout_obj.json');

Given('I am in Voila homepage', () => {
    cy.get(homeObj.userHeaderIdentifier).should('have.text', 'Irwan');
});

And('I add product to cart', () => {
    cy.visit(`${Cypress.env('WEBSITE_URL')}/collections/clothing/products/jw-anderson-bunny-embroidered-logo-t-shirt-navy`)
    cy.get(productObj.productTitle).should('have.text', 'Bunny Embroidered Logo T-Shirt Navy');
    cy.get(productObj.sizeChoosen).click();
    cy.get(productObj.addToCart).click();
    cy.get(productObj.seeCart).should('be.visible');
    cy.get(productObj.seeCart).click();
});

When('I go to cart page', () => {
    cy.url().should('equal', 'https://voila.id/cart');
    cy.get(checkoutObj.checkoutButton).click();
});

And('I provide my shipping address', () => {
    cy.contains('Alamat pengiriman').should('be.visible');
    cy.url().then(url => {
        let segmentedUrl = String(url).split('/');
        expect(segmentedUrl[3]).equal('checkouts');
        expect(segmentedUrl[6]).equal('information');
    });

    cy.contains('Lanjutkan ke pengiriman').click();
});

And('I choose shipping courier', () => {
    cy.get(checkoutObj.buyerShippingEmail).should('have.text', 'irwan.rosyadi@ralali.com');
    cy.url().then(url => {
        let segmentedUrl = String(url).split('/');
        expect(segmentedUrl[3]).equal('checkouts');
        expect(segmentedUrl[6]).equal('shipping');
    });

    cy.contains('Paxel (JAKARTA ONLY)').click();
    cy.contains('Lanjutkan ke pembayaran').click();
    cy.contains('Bayar sekarang').click();
});

And('I create order with {string} payment', (method) => {
    cy.get(checkoutObj.paymentPageTitle).should('have.text', 'Pembayaran');
    switch (method) {
        case method = 'Bank Transfer':
            cy.get(checkoutObj.paymentBankTransfer).should('be.visible');
            cy.get(checkoutObj.paymentBankTransfer).click();
            cy.get(checkoutObj.btnCreateOrder).click();
            // cy.contains('Selesaikan pesanan').click();
            break;
        case method = 'VA':
            cy.get(checkoutObj.paymentVA).should('be.visible');
            cy.get(checkoutObj.paymentVA).click();
            cy.get(checkoutObj.btnCreateOrder).click();
            // cy.contains('Bayar sekarang').click();
            break;
        default:
            cy.get(checkoutObj.paymentVA).should('be.visible');
            cy.get(checkoutObj.paymentVA).click();
            cy.contains('Bayar sekarang').click();
    }
});
