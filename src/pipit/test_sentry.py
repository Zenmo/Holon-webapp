import unittest

from pipit.sentry import consolidate_db_spans


class SentryTestCase(unittest.TestCase):
    def test_db_span_consolidation(self):
        db_span_1 = {
            "trace_id": "d3781e61351341b3ae826ac4d0cc0c52",
            "span_id": "84708db0844a65cc",
            "parent_span_id": "a2470a981d62e34a",
            "same_process_as_parent": True,
            "op": "db",
            "description": 'SELECT "car"."color" FROM "car" WHERE "car"."id" = 1',
            "start_timestamp": "2023-05-01T11:23:12.102930Z",
            "timestamp": "2023-05-01T11:23:12.103146Z",
        }
        db_span_2 = {
            "trace_id": "d3781e61351341b3ae826ac4d0cc0c52",
            "span_id": "a7b03029ef696615",
            "parent_span_id": "a2470a981d62e34a",
            "same_process_as_parent": True,
            "op": "db",
            "description": 'SELECT "car"."color" FROM "car" WHERE "car"."id" = 2',
            "start_timestamp": "2023-05-01T11:23:22.102930Z",
            "timestamp": "2023-05-01T11:23:22.103146Z",
        }
        render_span = {
            "trace_id": "d3781e61351341b3ae826ac4d0cc0c52",
            "span_id": "ac872634c3689148",
            "parent_span_id": "a2470a981d62e34a",
            "same_process_as_parent": True,
            "op": "view.response.render",
            "description": "serialize response",
            "start_timestamp": "2023-05-01T11:24:12.152660Z",
            "timestamp": "2023-05-01T11:24:12.182362Z",
        }

        event = {
            "type": "transaction",
            "spans": [
                db_span_1,
                db_span_2,
                render_span,
            ],
        }

        consolidated_event = consolidate_db_spans(event, {})

        self.assertEqual(
            consolidated_event,
            {
                "type": "transaction",
                "spans": [
                    render_span,
                    {
                        "trace_id": "d3781e61351341b3ae826ac4d0cc0c52",
                        "span_id": db_span_1["span_id"],
                        "parent_span_id": "a2470a981d62e34a",
                        "same_process_as_parent": True,
                        "op": "db",
                        "description": "consolidated span of 2 database queries",
                        "start_timestamp": db_span_1["start_timestamp"],
                        "timestamp": db_span_2["timestamp"],
                        "data": {
                            "Number of queries": 2,
                            "Consolidated Duration": "0.43ms",
                        },
                    },
                ],
            },
        )


if __name__ == "__main__":
    unittest.main()
