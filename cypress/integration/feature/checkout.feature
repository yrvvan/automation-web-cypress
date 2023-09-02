@checkout
Feature: Voila - End to end

     Scenario Outline: Successful Checkout
          Given I am in Voila homepage
          And I add product to cart
          When I go to cart page
          And I provide my shipping address
          And I choose shipping courier
          And I create order with "<paymentMethod>" payment method
          Then I see payment page with payment "<paymentMethod>"

          Examples:
               | paymentMethod |
               # | VA            |
               | Bank Transfer |