Feature: Dynamic table CPU value validation
  This feature verifies that the CPU load value shown for a specific process
  in the dynamic table is consistent with the CPU value displayed in the
  yellow label on the Dynamic Table page.

  Scenario: Verify Chrome CPU value from the table matches the yellow label
    Given I am on the dynamic table page
    When I read the CPU value for the Chrome process from the table
    And I read the CPU value from the yellow label
    Then the CPU value in the table should match the yellow label value