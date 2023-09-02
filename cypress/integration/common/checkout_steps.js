import { Given, When, And } from 'cypress-cucumber-preprocessor/steps'

const homeObj = require('../../support/object/home_obj.json');
const productObj = require('../../support/object/product_obj.json');
const checkoutObj = require('../../support/object/checkout_obj.json');

Given('I am in Voila homepage', () => {
    cy.get(homeObj.txtUserHeaderIdentifier).should('have.text', 'Irwan');
});

And('I add product to cart', () => {
    cy.visit(`${Cypress.env('WEBSITE_URL')}/collections/clothing/products/jw-anderson-bunny-embroidered-logo-polo-shirt-navy`)
    cy.get(productObj.txtProductTitle).should('have.text', 'Bunny Embroidered Logo Polo Shirt Navy');
    cy.get(productObj.btnSizeChoosen).click();
    cy.get(productObj.btnAddToCart).click();
    cy.get(productObj.btnSeeCart).should('be.visible');
    cy.get(productObj.btnSeeCart).click();
});

When('I go to cart page', () => {
    cy.url().should('equal', 'https://voila.id/cart');
    cy.get(checkoutObj.btnCheckoutButton).click();
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
    cy.get(checkoutObj.txtBuyerShippingEmail).should('have.text', 'irwan.rosyadi@ralali.com');
    cy.url().then(url => {
        let segmentedUrl = String(url).split('/');
        expect(segmentedUrl[3]).equal('checkouts');
        expect(segmentedUrl[6]).equal('shipping');
    });

    cy.contains('Paxel (JAKARTA ONLY)').click();
    cy.contains('Lanjutkan ke pembayaran').click();
    cy.contains('Bayar sekarang').click();
});

And('I create order with {string} payment method', (method) => {
    cy.get(checkoutObj.txtPaymentPageTitle).should('have.text', 'Pembayaran');
    switch (method) {
        case method = 'Bank Transfer':
            cy.get(checkoutObj.txtPaymentBankTransfer).should('be.visible');
            cy.get(checkoutObj.txtPaymentBankTransfer).click();
            cy.get(checkoutObj.btnCreateOrder).click();
            break;
        case method = 'VA':
            cy.get(checkoutObj.txtPaymentVA).should('be.visible');
            cy.get(checkoutObj.txtPaymentVA).click();
            cy.get(checkoutObj.btnCreateOrder).click();
            break;
        default:
            cy.get(checkoutObj.txtPaymentVA).should('be.visible');
            cy.get(checkoutObj.txtPaymentVA).click();
            cy.get(checkoutObj.btnCreateOrder).click();
    }
});

Then('I see payment page with payment {string}', (method) => {
    cy.contains('Semua metode pembayaran').should('be.visible');
    if (method == "VA") {
        cy.url().then(url => {
            let segmentedUrl = String(url).split('/');
            expect(segmentedUrl[2]).equal('app.midtrans.com');
            expect(segmentedUrl[7]).equal('payment-list');
        });
        cy.go('back')
    }
    cy.get(checkoutObj.txtPostOrderHeader).should('be.visible');
    cy.get(checkoutObj.txtPostOrderInfo).should('be.visible');
});
