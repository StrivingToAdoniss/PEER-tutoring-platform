from rest_framework import permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import UserSerializer


class UserRegistrationView(APIView):
    permission_classes = [permissions.AllowAny, ]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = UserSerializer(
            data=request.data, context={
                'request': request})
        if not (serializer.is_valid(raise_exception=True)
                and not request.user.is_authenticated):
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST)
        user = serializer.create(request.data)
        if user:
            return Response(serializer.data, status=status.HTTP_201_CREATED)
