<?
    class Router{
    	var $login;
    	function Router($login){
    		$this->login = $login;
			$this->rote($login);
    	}
		function rote($login){
			$a=explode('.',$_GET['a']);
				switch(array_shift($a)){
						case 'account':			
							require('Accounts.php');
							$ctr = new Accounts($login);
							$res = $ctr->process($a,$_GET,$_POST);
							echo (is_string($res)?$res:json_encode($res));
						break;
						case 'server_url':
							$out = new stdClass();
							$out->success = $_SERVER['SERVER_NAME'];
							echo json_encode($out);
						break;
						case 'LOG':
							$res =  error_log(date("Y-m-d H:i:s")."\r\n".file_get_contents("php://input"),3,'../logs/app_error.log');
							$out = new stdClass();
							if($res){
								$out->success = 'success';
								$out->result=$res;
							} else $out->error='error log';
							echo json_encode($out);
						break;
						case 'EMAIL':
							$headers = 'From: admin@front-desk.ca' . "\r\n" .'Reply-To: admin@front-desk.ca' . "\r\n" .'X-Mailer: PHP/' . phpversion();
							$res =  error_log(date("Y-m-d H:i:s")."\r\n".file_get_contents("php://input"),1,'uplight.ca@gmail.com',$headers);
							$out = new stdClass();
							if($res){
								$out->success = 'success';
								$out->result=$res;
							} else $out->error='error email';
							echo json_encode($out);
						break;
						case 'save_file':
						$file_name=explode('/',$_GET['file_name'])[0];
						echo file_put_contents('../data/'.$file_name,file_get_contents("php://input"));			
						break;
						case 'login':
							$res = $this->login->process($_POST);
							 echo (is_string($res)?$res:json_encode($res));
							break;
				}
		}
    }
?>