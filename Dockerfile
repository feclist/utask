FROM python:3.4

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*


ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code

ADD requirements.txt /code/

RUN apt-get update -y && apt-get install -y dos2unix

RUN useradd -ms /bin/bash -d /code utask
RUN pip install -r requirements.txt

ADD . /code/

COPY start.sh ./

RUN chown -R utask /code
RUN chmod +x /code/start.sh

RUN dos2unix /code/start.sh

EXPOSE 8000
ENTRYPOINT ["sh", "/code/start.sh"]
