# coding: utf-8

"""
    Trieve API

    Trieve OpenAPI Specification. This document describes all of the operations available through the Trieve API.

    The version of the OpenAPI document: 0.12.0
    Contact: developers@trieve.ai
    Generated by OpenAPI Generator (https://openapi-generator.tech)

    Do not edit the class manually.
"""  # noqa: E501


import unittest

from trieve_py_client.models.search_query_rating import SearchQueryRating

class TestSearchQueryRating(unittest.TestCase):
    """SearchQueryRating unit test stubs"""

    def setUp(self):
        pass

    def tearDown(self):
        pass

    def make_instance(self, include_optional) -> SearchQueryRating:
        """Test SearchQueryRating
            include_option is a boolean, when False only required
            params are included, when True both required and
            optional params are included """
        # uncomment below to create an instance of `SearchQueryRating`
        """
        model = SearchQueryRating()
        if include_optional:
            return SearchQueryRating(
                note = '',
                rating = 56
            )
        else:
            return SearchQueryRating(
                rating = 56,
        )
        """

    def testSearchQueryRating(self):
        """Test SearchQueryRating"""
        # inst_req_only = self.make_instance(include_optional=False)
        # inst_req_and_optional = self.make_instance(include_optional=True)

if __name__ == '__main__':
    unittest.main()