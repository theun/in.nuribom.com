import unittest

from pyramid import testing

class ViewTests(unittest.TestCase):
    def setUp(self):
        self.config = testing.setUp()

    def tearDown(self):
        testing.tearDown()

    def test_my_view(self):
        from .views import home, log
        request = testing.DummyRequest()
        info = home(request)
        log.info(info)
        self.assertEqual(info['project'], 'MyProject')
