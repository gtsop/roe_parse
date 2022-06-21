#!/usr/bin/env bats

bugcrowd_tesla_html=
setup() {
    load 'test_helper/bats-support/load'
    load 'test_helper/bats-assert/load'

    # get the containing directory of this file
    # use $BATS_TEST_FILENAME instead of ${BASH_SOURCE[0]} or $0,
    # as those will point to the bats executable's location or the preprocessed file respectively
    DIR="$( cd "$( dirname "$BATS_TEST_FILENAME" )" >/dev/null 2>&1 && pwd )"
    # make executables in src/ visible to PATH
    PATH="$DIR/../src:$PATH"
}

@test "it parses the bugcrowd html and outputs in-scope items" {
	run bash -c "cat test/fixtures/https_bugcrowd_com_tesla_21_06_2022.html | node index.js"
	assert_line "scope:include:*.tesla.com"
	assert_line "scope:include:*.tesla.cn"
}

@test "it parses the bugcrowd html and outputs out-of-scope items" {
	run bash -c "cat test/fixtures/https_bugcrowd_com_tesla_21_06_2022.html | node index.js"
	assert_line "scope:exclude:employeefeedback.tesla.com"
	assert_line "scope:exclude:feedback.tesla.com"
}

@test "it parses the bugcrowd html and outputs multiple in-scope items" {
	run bash -c "cat test/fixtures/https_bugcrowd_com_seek_21_06_2022.html | node index.js"
	assert_line "scope:include:*.seek.com.au"
	assert_line "scope:include:graphql.seek.com"
}
