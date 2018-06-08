import json

from django.http import JsonResponse

from keystroke_auth_server.constants.response_statuses import RESPONSE_STATUS, RESPONSE
from keystroke_auth_server.models import User
from keystroke_auth_server.models_utils.keystroke_manager import KeyStrokeManager
from keystroke_auth_server.utils.custom_exceptions import InvalidKeystrokeException
from keystroke_auth_server.utils.dict_get import dict_get


def register_keystroke(request):
    data = json.loads(request.body)
    login, login_timestamps, password_timestamps = dict_get(data, 'login', 'login_timestamps', 'password_timestamps')

    user, _ = User.objects.get_or_create(login=login)

    keystroke_manager = KeyStrokeManager(user)

    try:
        keystroke_manager.factory.create_temporary_keystrokes_from_timestamps(login_timestamps, password_timestamps)
    except InvalidKeystrokeException:
        return JsonResponse(RESPONSE['INVALID_KEYSTROKE'])

    temporary_keystrokes_count = keystroke_manager.get_keystrokes_count(is_temporary=True)

    if temporary_keystrokes_count == 1:
        return JsonResponse(RESPONSE['NEED_MORE_SAMPLE'])

    if temporary_keystrokes_count >= KeyStrokeManager.REGISTRATION_SAMPLES_COUNT:
        keystroke_manager.delete_keystrokes(is_temporary=False)
        keystroke_manager.factory.create_average_keystrokes()
        keystroke_manager.delete_keystrokes(is_temporary=True)
        return JsonResponse(RESPONSE['SUCCESS'])

    return JsonResponse(RESPONSE['NEED_MORE_SAMPLE'])


def authenticate_keystroke(request):
    data = json.loads(request.body)
    login, login_timestamps, password_timestamps = dict_get(data, 'login', 'login_timestamps', 'password_timestamps')

    user = User.objects.filter(login=login).first()

    if not user:
        return JsonResponse({
            'status': RESPONSE_STATUS['ERROR'],
            'message': 'User with login ' + login + ' not found.'
        })

    keystroke_manager = KeyStrokeManager(user)
    keystroke_count = keystroke_manager.get_keystrokes_count(is_temporary=False)

    if not keystroke_count:
        return JsonResponse({
            'status': RESPONSE_STATUS['ERROR'],
            'message': 'User with login ' + login + ' has no associated keystroke.'
        })

    try:
        auth_result = keystroke_manager.authenticate(login_timestamps, password_timestamps)
    except InvalidKeystrokeException:
        return JsonResponse(RESPONSE['INVALID_KEYSTROKE'])

    return JsonResponse({
        'status': RESPONSE_STATUS['SUCCESS'],
        'message': auth_result['message'],
    })


