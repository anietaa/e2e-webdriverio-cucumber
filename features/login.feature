Feature: Login to secure area on ExpandTesting practice site

  Background:
    Given I am on the login page

  @positive
  Scenario Outline: Successful login with valid credentials
    When I login with username "<username>" and password "<password>"
    Then I should be redirected to the secure area
    And I should see a success flash message "<loginMessage>"
    And I should see the logout button
    And I should see a logout flash message "<logoutMessage>"

    Examples:
      | username | password              | loginMessage                      | logoutMessage                          |
      | practice | SuperSecretPassword!  | You logged into a secure area!    | You logged out of the secure area!     |

  @negative
  Scenario Outline: Login failure scenarios
    When I login with username "<username>" and password "<password>"
    Then I should see an error flash message "<message>"

    Examples:
  | username   | password              | message                    |
  | tomsmith   | wrongPassword         | Your password is invalid!  |
  | wrongUser  | SuperSecretPassword!  | Your password is invalid!  |
  | wrongUser  | wrongPassword         | Your username is invalid!  |