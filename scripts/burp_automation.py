#!/usr/bin/env python3
"""
Burp Suite Automation Script for Gerobak Jogja Pentest
This script helps automate common testing tasks with Burp Suite API
"""

import requests
import json
import time
import sys
import argparse
from urllib.parse import urljoin

class BurpAutomation:
    def __init__(self, burp_host='127.0.0.1', burp_port=1337):
        """
        Initialize Burp Suite automation
        Note: Requires Burp Suite Professional with REST API enabled
        """
        self.burp_url = f"http://{burp_host}:{burp_port}"
        self.session = requests.Session()
        
    def check_burp_connection(self):
        """Check if Burp Suite API is accessible"""
        try:
            response = self.session.get(f"{self.burp_url}/burp/versions")
            if response.status_code == 200:
                print("[+] Connected to Burp Suite API")
                return True
            else:
                print("[-] Failed to connect to Burp Suite API")
                return False
        except requests.exceptions.ConnectionError:
            print("[-] Cannot connect to Burp Suite API. Make sure:")
            print("    1. Burp Suite Professional is running")
            print("    2. REST API is enabled in Burp")
            print("    3. API is listening on 127.0.0.1:1337")
            return False
    
    def start_scan(self, target_url, scan_type='active'):
        """Start an active or passive scan"""
        scan_data = {
            "urls": [target_url],
            "scan_type": scan_type
        }
        
        try:
            response = self.session.post(
                f"{self.burp_url}/burp/scanner/scans/active",
                json=scan_data
            )
            
            if response.status_code == 201:
                scan_id = response.json().get('scan_id')
                print(f"[+] Started {scan_type} scan with ID: {scan_id}")
                return scan_id
            else:
                print(f"[-] Failed to start scan: {response.text}")
                return None
        except Exception as e:
            print(f"[-] Error starting scan: {e}")
            return None
    
    def get_scan_status(self, scan_id):
        """Get the status of a running scan"""
        try:
            response = self.session.get(f"{self.burp_url}/burp/scanner/scans/{scan_id}")
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[-] Failed to get scan status: {response.text}")
                return None
        except Exception as e:
            print(f"[-] Error getting scan status: {e}")
            return None
    
    def get_scan_issues(self, scan_id=None):
        """Get issues found by scanner"""
        try:
            url = f"{self.burp_url}/burp/scanner/issues"
            if scan_id:
                url += f"?scan_id={scan_id}"
            
            response = self.session.get(url)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"[-] Failed to get scan issues: {response.text}")
                return None
        except Exception as e:
            print(f"[-] Error getting scan issues: {e}")
            return None
    
    def send_to_intruder(self, request_data, payload_positions, payloads):
        """Send request to Burp Intruder"""
        intruder_data = {
            "request": request_data,
            "payload_positions": payload_positions,
            "payloads": payloads
        }
        
        try:
            response = self.session.post(
                f"{self.burp_url}/burp/intruder/attacks",
                json=intruder_data
            )
            
            if response.status_code == 201:
                attack_id = response.json().get('attack_id')
                print(f"[+] Started Intruder attack with ID: {attack_id}")
                return attack_id
            else:
                print(f"[-] Failed to start Intruder attack: {response.text}")
                return None
        except Exception as e:
            print(f"[-] Error starting Intruder attack: {e}")
            return None

def load_payloads(payload_file):
    """Load payloads from file"""
    try:
        with open(payload_file, 'r', encoding='utf-8') as f:
            payloads = [line.strip() for line in f if line.strip() and not line.startswith('#')]
        return payloads
    except FileNotFoundError:
        print(f"[-] Payload file not found: {payload_file}")
        return []

def test_xss_endpoints(burp, target_base):
    """Test XSS on common endpoints"""
    print("[+] Testing XSS vulnerabilities...")
    
    xss_payloads = load_payloads('payloads/xss_payloads.txt')
    if not xss_payloads:
        print("[-] No XSS payloads loaded")
        return
    
    # Test endpoints
    endpoints = [
        '/kontak',
        '/admin',
        '/blog',
        '/search'
    ]
    
    for endpoint in endpoints:
        target_url = urljoin(target_base, endpoint)
        print(f"[+] Testing XSS on: {target_url}")
        
        # Start scan for this endpoint
        scan_id = burp.start_scan(target_url, 'active')
        if scan_id:
            print(f"[+] Scan started for {endpoint}")

def test_sqli_endpoints(burp, target_base):
    """Test SQL injection on common endpoints"""
    print("[+] Testing SQL injection vulnerabilities...")
    
    sqli_payloads = load_payloads('payloads/sqli_payloads.txt')
    if not sqli_payloads:
        print("[-] No SQL injection payloads loaded")
        return
    
    # Test login endpoint
    login_url = urljoin(target_base, '/admin')
    print(f"[+] Testing SQL injection on login: {login_url}")
    
    scan_id = burp.start_scan(login_url, 'active')
    if scan_id:
        print(f"[+] SQL injection scan started")

def generate_report(burp, output_file='pentest_report.json'):
    """Generate a report of all findings"""
    print("[+] Generating pentest report...")
    
    issues = burp.get_scan_issues()
    if issues:
        with open(output_file, 'w') as f:
            json.dump(issues, f, indent=2)
        print(f"[+] Report saved to: {output_file}")
    else:
        print("[-] No issues found or failed to retrieve issues")

def main():
    parser = argparse.ArgumentParser(description='Burp Suite Automation for Gerobak Jogja Pentest')
    parser.add_argument('--target', default='http://localhost:8888', help='Target URL')
    parser.add_argument('--burp-host', default='127.0.0.1', help='Burp Suite API host')
    parser.add_argument('--burp-port', default=1337, type=int, help='Burp Suite API port')
    parser.add_argument('--test-xss', action='store_true', help='Test XSS vulnerabilities')
    parser.add_argument('--test-sqli', action='store_true', help='Test SQL injection')
    parser.add_argument('--full-scan', action='store_true', help='Run full automated scan')
    parser.add_argument('--report', action='store_true', help='Generate report')
    
    args = parser.parse_args()
    
    # Initialize Burp automation
    burp = BurpAutomation(args.burp_host, args.burp_port)
    
    # Check connection
    if not burp.check_burp_connection():
        sys.exit(1)
    
    print(f"[+] Target: {args.target}")
    
    # Run tests based on arguments
    if args.test_xss or args.full_scan:
        test_xss_endpoints(burp, args.target)
    
    if args.test_sqli or args.full_scan:
        test_sqli_endpoints(burp, args.target)
    
    if args.full_scan:
        print("[+] Running full scan...")
        scan_id = burp.start_scan(args.target, 'active')
        
        if scan_id:
            print("[+] Waiting for scan to complete...")
            while True:
                status = burp.get_scan_status(scan_id)
                if status and status.get('scan_status') == 'finished':
                    print("[+] Scan completed!")
                    break
                elif status and status.get('scan_status') == 'failed':
                    print("[-] Scan failed!")
                    break
                else:
                    print("[+] Scan in progress...")
                    time.sleep(30)
    
    if args.report:
        generate_report(burp)

if __name__ == '__main__':
    main()