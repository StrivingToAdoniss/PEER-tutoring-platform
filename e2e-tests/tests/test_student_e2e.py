import os

from selenium.webdriver.common.by import By
from selenium.webdriver.firefox.webdriver import WebDriver
from tenacity import sleep

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://nginx")


def test_student_e2e(driver: WebDriver):
    driver.implicitly_wait(5)

    student_sign_up(driver)
    student_log_in(driver)
    student_log_out(driver)


def student_sign_up(driver):
    driver.get(FRONTEND_URL)

    driver.find_element(by=By.XPATH, value='//button[text()="Sign up"]').click()
    driver.find_element(by=By.XPATH, value='//h3[text()="Student"]/..').click()

    # Fill out the student sign-up form
    driver.find_element(by=By.NAME, value='first_name').send_keys('Marco')
    driver.find_element(by=By.NAME, value='last_name').send_keys('Polo')

    # Select institute
    institute_select = driver.find_element(by=By.NAME, value='university')
    institute_select.click()
    institute_select.find_element(by=By.XPATH, value='//option[text()="Ghent University"]').click()

    # Select course number
    course_select = driver.find_element(by=By.NAME, value='current_grade')
    course_select.click()
    course_select.find_element(by=By.XPATH, value='//option[text()="2"]').click()

    # Select specialty
    specialty_select = driver.find_element(by=By.NAME, value='specialization')
    specialty_select.click()
    specialty_select.find_element(by=By.XPATH, value='//option[text()="Physics"]').click()

    driver.find_element(by=By.NAME, value='email').send_keys('marcopolo@example.com')
    driver.find_element(by=By.NAME, value='username').send_keys('MarcoPolo11')
    driver.find_element(by=By.NAME, value='password').send_keys('Securepassword1234!!!')

    driver.find_element(by=By.XPATH, value='//button[text()="Register"]').click()


def student_log_in(driver):
    driver.get(FRONTEND_URL)

    driver.find_element(by=By.XPATH, value='//button[text()="Log in"]').click()
    driver.find_element(By.XPATH, '//input[@type="password"]').send_keys('Securepassword1234!!!')
    driver.find_element(By.XPATH, '//input[@type="email"]').send_keys('marcopolo@example.com')

    driver.find_element(By.XPATH, '//button[@type="submit" and contains(@class, "login-button")]').click()

def student_log_out(driver):
    driver.find_element(By.XPATH, '//img[@class="logout-button" and @alt="Log out"]').click()
